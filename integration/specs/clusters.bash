#!/bin/bash

easyCluster

clusters=$ENDPOINT/clusters

it should return an empty array initially
equal "`$curl $clusters`" '[]'

it can create clusters
result="`$curl -d "workerPath=$(worker 'live-forever.js')" $clusters`"
has "$result" 'name": null'
has "$result" 'live-forever.js'
has "$result" '"strategy": "simple"'
has "$result" '"pid": [0-9]'

it can create clusters by name
result="`$curl -d "workerPath=$(worker 'live-forever.js')&name=someName" $clusters`"
has "$result" 'name": "someName"'

it may not share ports between clusters
$curl -d "workerPath=$(worker 'listen-on-5643.js')&name=5643" $clusters > $NULL
$curl -f -d "workerPath=$(worker 'listen-on-5643.js')" $clusters && fail

it may update a cluster that uses an http port
id="`$curl $clusters?name=5643 | grep -m 1 -o 'id": [0-9]*' | grep -o '[0-9]*'`"
$curl -X PUT -d workerPath="$(worker 'listen-on-5643.js')" $clusters/$id > $NULL
