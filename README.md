Experimental web version of my Elegoo 3D Printer Monitor.

The [standalone version](https://github.com/ssewell/Elegoo3DPrinterMonitor) is recommended unless you have a specific need to run this as a web service.

## How to Use

Once you've pulled this repo locally, you have the option of running as a local server or as a Docker container.

The application must be accessed via the IP address on port 3000 (e.g. http://[ip address]:3000). If you wish to access it via a host name, you must set the environment variable "ELEGOO_MONITOR_SERVER_HOSTNAME", specifying the hostname including the port (e.g. http://[server hostname]:3000)

### Running Local Server

Build the application:

```shell
npm run build
```

Start the application:

```shell
npx serve build
```

### Running via Docker

Build the Docker container:

```shell
docker build -t elegoo3dprintermonitorweb:latest .
```

Run the docker conatiner:

```shell
docker run --network="host" -e ELEGOO_MONITOR_SERVER_HOSTNAME='http://[your servername]:3000' elegoo3dprintermonitorweb:latest
```

IMPORTANT: You must run the container in a mode that yields access to port 3000 (for both TCP and UDP) and port 5000 (TCP). Broadcast of UDP packets must be supported in order to discover Elegoo 3D Printers on the network. This is easily achived by using Docker's "host" network mode. This is only supported on Linux.
