provider "google" {
  credentials = file("cloud-5409-f96d52db83ec.json")
  project     = "cloud-5409"
  region      = "us-central1"
}

resource "google_container_cluster" "my_cluster" {
  name     = "cloud-5409-a3-gke-cluster"
  location = "us-central1"

  initial_node_count = 1

  node_config {
    machine_type      = "e2-micro"
    disk_type = "pd-standard"
    disk_size_gb = 10
    image_type        = "COS_CONTAINERD"
  }

#  kubelet_config {
#    volume_mounts {
#      name       = "my-persistent-volume"
#      mount_path = "/shubham_PV_dir"
#    }
#  }

}

resource "google_compute_disk" "my_persistent_disk" {
  name  = "cloud-5409-a3-gke-persistent-disk"
  size  = 10
  type  = "pd-standard"
  zone  = "us-central1-a"
}
