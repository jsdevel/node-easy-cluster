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
Once you've installed the package, start the daemon by running `easy-cluster` from a tty.

Clusters are managed via a REST API, so starting the daemon is the initial step needed before moving forward.

###API
This is a high level overview of the REST API understood by the daemon:
* `/api` - Prints everything daemon related.
* `/api/clusters` - Allows you to manage clusters in the daemon.
