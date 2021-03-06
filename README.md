easy-cluster
======================
[![Build Status](https://travis-ci.org/jsdevel/node-easy-cluster.png)](https://travis-ci.org/jsdevel/node-easy-cluster)

````
                                     ^
                                    //\
                                       \
                  \\              .__=. \
                   \____        ,' -(@)\-\<)
                    \__ \      (_______/_:\
                   >==.\ \___,'  /# #\ | : \____
                     ,\\\___/|_|##(O)##| `./\---.
                    / ,`--'   ,======'//, //.\ . \
                   ( ______)_//<_> O////  ( (@O ) )
                    (________/ ====='o'    \ `-' /
                     `----'                 `---'
````

`easy-cluster`, so named after easy rider and node's cluster module, is a
painless, simple, easy going daemon to manage multiple node.js clusters.  It
exposes an interface via REST that is rock solid and stable.  The way you want
your deployments in production to be.

##Installation
`npm install -g easy-cluster`

##Usage
Once you've installed the package, start the daemon by running `ecluster` from a tty.

Clusters are managed via a REST API, so starting the daemon is the initial step needed before moving forward.

##API Overview
This is the REST API understood by the daemon.

Property names enclosed in `[]` are considered optional for `POST` operations.
Property names enclosed in `{}` are ignored for `POST` operations.

###`/`
Prints everything daemon related.

#####Properties
* `clusters` - An array of clusters.

#####Methods
* `GET /` - Retrieves all data managed by the daemon.

###`/clusters`
Allows you to manage clusters in the daemon.  Each cluster starts a new master process that forks workers.  The process of loading, reloading, and responding to the death of workers is governed by a strategy.  The default strategy is "simple".

#####Properties
* `{id}` - The id of the cluster.  Every cluster has this.  Ids are numerical.
* `pid` - The pid of the master process.
* `[name]` - This is the name of the cluster.  Names are not shared between clusters, so they act as a friendly id.
* `[strategy]` - The strategy the cluster uses to manage workers.  By default the value is `simple`.  These are valid strategies:
  * `simple` - Workers are killed immediately without notice on any update.  When a worker dies, a new one is immediately created.
* `workerPath` - This is an absolute path to a worker file.  The cluster will use this when forking workers.

#####Methods
* `DELETE /clusters/:id` - Deletes a cluster.
* `GET /clusters` - Retrieves all clusters currently loaded.
* `GET /clusters/:id` - Retrieves a cluster by id.
* `GET /clusters?name=name` - Retrieves a cluster by name.
* `POST /clusters` - Creates a cluster.
* `PUT /clusters/:id` - Updates a cluster.
