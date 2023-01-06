#!/bin/bash -l
DIR_PATH=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd "$DIR_PATH/.."
mkdir cron/data
touch cron/data/players-new.json
touch cron/data/players-old.json
mkdir cron/logs
touch cron/logs/log.txt
node --loader ts-node/esm --no-warnings cron/fetchStats.ts 2>&1 | tee cron/logs/log.txt
