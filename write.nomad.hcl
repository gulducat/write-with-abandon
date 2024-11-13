job "write" {
  group "g" {
    network {
      port "http" {
        static = 8001
        #to = 8080
      }
    }
    service {
      name = "write"
      port = "http"
      tags = [
        "traefik.enable=true",
        "traefik.http.routers.write.rule=PathPrefix(`/write`)",
      ]
      provider = "nomad"
    }
    task "t" {
      driver = "docker"
      config {
        # https://caddyserver.com/docs/quick-starts/static-files
        image   = "caddy:alpine"
        command = "caddy"
        args = [
          "file-server",
          "--listen", ":${NOMAD_PORT_http}",
          "--root", "${NOMAD_TASK_DIR}/app",
        ]
        ports = ["http"]
      }
      template {
        destination = "${NOMAD_TASK_DIR}/app/index.html"
        data = file("index.html")
      }
      template {
        destination = "${NOMAD_TASK_DIR}/app/script.js"
        data = file("script.js")
      }
    }
  }
}
