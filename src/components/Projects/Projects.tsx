'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Projects.module.scss';

const SAMPLE_FILES: Record<string, string> = {
  'handler.py': `"""
API Handler Lambda

Provides REST API endpoints for querying FPL predictions from DynamoDB.
Uses AWS Lambda Powertools for routing and structured logging.
"""

import os
from decimal import Decimal
from typing import Any

from aws_lambda_powertools import Logger
from aws_lambda_powertools.event_handler import APIGatewayRestResolver, CORSConfig
from boto3.dynamodb.conditions import Key

from common.aws_clients import get_dynamodb_resource

logger = Logger(service="fpl-api")
cors = CORSConfig(allow_origin=os.getenv("CORS_ALLOW_ORIGIN", "*"))
app = APIGatewayRestResolver(cors=cors)

TABLE_NAME = os.getenv("TABLE_NAME", "fpl-predictions")


def _decimal_to_float(obj: Any) -> Any:
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, dict):
        return {k: _decimal_to_float(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_decimal_to_float(x) for x in obj]
    return obj


@app.get("/top")
def top_predictions():
    gw = int(app.current_event.get_query_string_value("gameweek"))
    position = app.current_event.get_query_string_value("position")
    limit = int(app.current_event.get_query_string_value("limit", "15"))

    table = get_dynamodb_resource().Table(TABLE_NAME)
    resp = table.query(
        KeyConditionExpression=Key("gameweek").eq(gw),
        FilterExpression=Key("position").eq(position) if position else None,
    )
    rows = sorted(resp["Items"], key=lambda r: r["haul_probability"], reverse=True)
    return {"predictions": _decimal_to_float(rows[:limit])}


def lambda_handler(event, context):
    return app.resolve(event, context)
`,
  'template.yaml': `AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Auto-Haaland FPL Prediction System

Globals:
  Function:
    Runtime: python3.12
    MemorySize: 512
    Timeout: 30
    Tracing: Active

Resources:
  ApiHandlerFn:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: lambdas/
      Handler: api_handler.handler.lambda_handler
      Environment:
        Variables:
          TABLE_NAME: !Ref PredictionsTable
      Events:
        Top:
          Type: Api
          Properties:
            Path: /top
            Method: GET

  PredictionsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: gameweek
          AttributeType: N
        - AttributeName: player_id
          AttributeType: N
      KeySchema:
        - AttributeName: gameweek
          KeyType: HASH
        - AttributeName: player_id
          KeyType: RANGE
`,
  'README.md': `# auto-haaland

An automated Fantasy Premier League prediction system using XGBoost
and AWS — Python 3.12, deployed with SAM.

## What it does
- Fetches live FPL data via the official API on a schedule
- Lambda-based pipeline processes player statistics into ML features
- XGBoost model trained on SageMaker; batch predictions persist to DynamoDB
- REST API (Lambda + Powertools) serves predictions to the frontend
- Full local dev environment with LocalStack

## Live frontend
The numbers feed the React page at /FPL — that page is just a view;
this repo is where the work happens.
`,
};

const STACK = ['Python', 'XGBoost', 'AWS Lambda', 'SageMaker', 'DynamoDB', 'SAM'];

const REPO_URL = 'https://github.com/juanE98/auto-haaland';

function fileIconLabel(name: string): string {
  const ext = name.split('.').pop() ?? '';
  const map: Record<string, string> = {
    py: 'PY',
    yml: 'YML',
    yaml: 'YML',
    md: 'MD',
    json: '{ }',
  };
  return map[ext] ?? '·';
}

function languageFor(name: string): string {
  if (name.endsWith('.py')) return 'Python';
  if (name.endsWith('.yml') || name.endsWith('.yaml')) return 'YAML';
  return 'Markdown';
}

function LineNumbers({ count }: { count: number }) {
  return (
    <div className={styles.lineNumbers} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
}

function FeaturedProject() {
  const [tab, setTab] = useState<string>('handler.py');
  const [code, setCode] = useState<Record<string, string>>(SAMPLE_FILES);
  const tabs = Object.keys(code);

  const update = (val: string) => {
    setCode((c) => ({ ...c, [tab]: val }));
  };

  const activeContent = code[tab] ?? '';
  const lineCount = activeContent.split('\n').length;

  return (
    <div className={styles.projectGrid}>
      <div className={styles.leftCol}>
        <div className={styles.featuredKicker}>Featured</div>
        <h3 className={styles.projectTitle}>Auto-Haaland</h3>
        <p className={styles.projectBody}>
          A Python-based Fantasy Premier League prediction system. XGBoost
          trained on SageMaker, a Lambda pipeline crunches fixtures and form
          into ML features, and an API Gateway endpoint serves the predictions
          out of DynamoDB. The frontend below is just a view onto it.
        </p>
        <div className={styles.stackChips}>
          {STACK.map((t) => (
            <span key={t} className={styles.chip}>
              {t}
            </span>
          ))}
        </div>
        <div className={styles.actions}>
          <Link href="/fpl" className={styles.primaryBtn}>
            <span aria-hidden="true">↗</span>
            <span>see it live &middot; /FPL</span>
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryBtn}
          >
            <span aria-hidden="true">{'</>'}</span>
            <span>repo on github</span>
          </a>
        </div>
        <div className={styles.hint}>
          {'// '}Edit the code on the right &mdash; it&apos;s a real, focusable
          editor. Switch tabs above.
        </div>
      </div>

      <div className={styles.ide}>
        <div className={styles.titleBar}>
          <span className={`${styles.dot} ${styles.dotRed}`} />
          <span className={`${styles.dot} ${styles.dotAmber}`} />
          <span className={`${styles.dot} ${styles.dotGreen}`} />
          <span className={styles.titleCaption}>~/projects/auto-haaland</span>
        </div>
        <div className={styles.tabStrip} role="tablist">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            >
              <span className={styles.fileIcon}>{fileIconLabel(t)}</span>
              <span>{t}</span>
            </button>
          ))}
        </div>
        <div className={styles.editor}>
          <LineNumbers count={lineCount} />
          <textarea
            value={activeContent}
            onChange={(e) => update(e.target.value)}
            spellCheck={false}
            className={styles.textarea}
            aria-label={`Editor for ${tab}`}
          />
        </div>
        <div className={styles.statusBar}>
          <span className={styles.statusEditable}>● editable</span>
          <span>UTF-8 &middot; LF &middot; {languageFor(tab)}</span>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <div className={styles.cmdLine}>
          <span className={styles.cmdPrompt}>$</span> systemctl status auto-haaland
        </div>
        <div className={styles.titleRow}>
          <span className={styles.indexNum}>04.</span>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <span className={styles.titleRule} aria-hidden="true" />
          <span className={styles.kicker}>A FEATURED BUILD</span>
        </div>
      </div>
      <FeaturedProject />
    </div>
  );
}
