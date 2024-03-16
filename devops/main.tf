terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}
variable "do_token" {}
variable "ssh_key" {}
variable "ssh_larvel" {}



provider "digitalocean" {
  token = var.do_token
}

variable "ssh_key_path" {
  description = "/home/antonstankov/.ssh/id_rsa.pub"
  default     = "/home/antonstankov/.ssh/id_rsa.pub"
}

variable "droplet_name" {
  description = "Name for the droplet"
  default     = "example-droplet"
}

variable "region" {
  description = "DigitalOcean region"
  default     = "nyc3"
}

variable "size" {
  description = "Droplet size"
  default     = "s-1vcpu-2gb"
}

resource "digitalocean_ssh_key" "ssh_key" {
  name       = "terraform"
  public_key = var.ssh_key
}

resource "digitalocean_ssh_key" "ssh_larvel" {
  name       = "terraform"
  public_key = var.ssh_larvel
}



resource "digitalocean_firewall" "firewall" {
  name = "example-firewall"

  droplet_ids = [
    digitalocean_droplet.jenkins.id,
    digitalocean_droplet.larvel.id,
    digitalocean_droplet.python.id,
    digitalocean_droplet.java.id
  ]

  inbound_rule {
    protocol           = "tcp"
    port_range         = "1-65535"
    source_addresses   = ["0.0.0.0/0"]
  }
  inbound_rule {
    protocol           = "tcp"
    port_range         = "3306"
    source_addresses   = ["0.0.0.0/0"]
  }
  outbound_rule {
    protocol           = "tcp"
    port_range         = "3306"
    destination_addresses = ["0.0.0.0/0"]
  }
  inbound_rule {
    protocol           = "tcp"
    port_range         = "22"
    source_addresses   = ["0.0.0.0/0"]
  }
  outbound_rule {
    protocol           = "tcp"
    port_range         = "1-65535"
    destination_addresses = ["0.0.0.0/0"]
  }
  inbound_rule {
    protocol           = "tcp"
    port_range         = "5000"
    source_addresses   = ["0.0.0.0/0"]
  }
  outbound_rule {
    protocol           = "tcp"
    port_range         = "5000"
    destination_addresses = ["0.0.0.0/0"]
  }
  outbound_rule {
    protocol           = "tcp"
    port_range         = "22"
    destination_addresses = ["0.0.0.0/0"]
  }
  inbound_rule {
    protocol           = "tcp"
    port_range         = "80"
    source_addresses   = ["0.0.0.0/0"]
  }
  outbound_rule {
    protocol           = "tcp"
    port_range         = "80"
    destination_addresses = ["0.0.0.0/0"]
  }
  inbound_rule {
    protocol           = "tcp"
    port_range         = "443"
    source_addresses   = ["0.0.0.0/0"]
  }
  outbound_rule {
    protocol           = "tcp"
    port_range         = "443"
    destination_addresses = ["0.0.0.0/0"]
  }
}

resource "digitalocean_droplet" "jenkins" {
  name   = "jenkins"
  region = var.region
  size   = var.size
  image  = "ubuntu-20-04-x64"
  
  ssh_keys    = [digitalocean_ssh_key.ssh_key.fingerprint]
  monitoring  = true
  ipv6        = true
}

resource "digitalocean_droplet" "larvel_server_2" {
  name   = "larvel"
  region = var.region
  size   = var.size
  image  = "ubuntu-20-04-x64"
  
  ssh_keys    = [digitalocean_ssh_key.ssh_larvel.fingerprint]
  monitoring  = true
  ipv6        = true
}

resource "digitalocean_droplet" "larvel" {
  name   = "larvel"
  region = var.region
  size   = var.size
  image  = "ubuntu-20-04-x64"
  
  ssh_keys    = [digitalocean_ssh_key.ssh_key.fingerprint]
  monitoring  = true
  ipv6        = true
}

resource "digitalocean_droplet" "java" {
  name   = "java"
  region = var.region
  size   = var.size
  image  = "ubuntu-20-04-x64"
  
  ssh_keys    = [digitalocean_ssh_key.ssh_key.fingerprint]
  monitoring  = true
  ipv6        = true
}

resource "digitalocean_droplet" "python" {
  name   = "python"
  region = var.region
  size   = var.size
  image  = "ubuntu-20-04-x64"
  
  ssh_keys    = [digitalocean_ssh_key.ssh_key.fingerprint]
  monitoring  = true
  ipv6        = true
}

