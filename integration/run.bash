#!/bin/bash

curl="`which curl` -s"
NULL=/dev/null
INTEGRATION_DIR=$(dirname $(readlink -f ${BASH_SOURCE[@]}))
PROJECT_DIR=$(dirname $INTEGRATION_DIR);
FIXTURE_DIR=$INTEGRATION_DIR/fixtures
WORKER_DIR=$FIXTURE_DIR/workers
SPEC_DIR=$INTEGRATION_DIR/specs
BIN_DIR=$PROJECT_DIR/bin
SUT=$BIN_DIR/easy-cluster.js
ENDPOINT=localhost:18675

function equal(){
  if [ -z "$1" ];then
    echo "equal expects arguments."
    exitWith 1;
    return
  fi

  if [ -z "$2" ];then
    echo "equal expects 2 arguments."
    exitWith 1;
    return
  fi

  if [ "$1" != "$2" ];then
    echo "AssertionError: $1 wasn't equal to $2";
    exitWith 1;
  fi
}

function has(){
  if [ -z "$1" ];then
    echo "has expects arguments."
    exitWith 1
    return
  fi

  if [ -z "$2" ];then
    echo "has expects 2 arguments."
    exitWith 1
    return
  fi

  if [ -z "`echo "$1" | grep "$2"`" ];then
    echo "AssertionError: Could not find '$2' in '$1'."
    exitWith 1
  fi
}

function easyCluster(){
  $SUT "$@" > /dev/null 2>&1 &
  sleep 0.5
}

function stopEasyCluster(){
  pkill -f easy-cluster
}

function exitWith(){
  stopEasyCluster
  sleep 0.5
  exit "$1"
}

function fail(){
  echo "$*"
  exit 1
}

function worker(){
  echo "$WORKER_DIR/$1"
}

function it(){
  echo "   $*"
}

stopEasyCluster

for script in `find $SPEC_DIR -name '*.bash'`;do
  case $script in
    *test.bash*);;
    *.bash)
      echo "$(basename $script .bash)"
      result=''
      . $script
      stopEasyCluster
      ;;
    *)exit;;
  esac
done
