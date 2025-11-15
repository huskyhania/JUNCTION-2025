import subprocess
import time
import sys
import os

MIN_NODE_VERSION = (20, 0, 0)  # bump to (20, 0, 0) if you REALLY need Node 20


def check_node_version():
    """Returns (major, minor, patch) or None if node missing."""
    try:
        result = subprocess.run(
            ["node", "--version"],
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            print("[INFO] 'node --version' failed, return code:", result.returncode)
            return None

        raw = result.stdout.strip()
        version_str = raw.lstrip("v")
        parts = tuple(int(x) for x in version_str.split("."))

        print(f"[INFO] Detected Node.js version: {raw} -> parsed {parts}")
        return parts
    except Exception as e:
        print(f"[INFO] Error checking Node.js version: {e}")
        return None


def ensure_node_version():
    version = check_node_version()
    print(f"[INFO] Minimum required Node.js version: {MIN_NODE_VERSION}")

    if version is None:
        print(
            "\n[ERROR] Node.js is not installed or not available on PATH.\n"
            "Please install Node.js (recommended via nvm), then rerun:\n"
            "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash\n"
            "  source ~/.nvm/nvm.sh\n"
            "  nvm install --lts\n"
        )
        sys.exit(1)

    if version < MIN_NODE_VERSION:
        print(
            f"\n[ERROR] Your Node.js version is {version}, but this project requires at least {MIN_NODE_VERSION}.\n"
            "Please upgrade Node.js (recommended via nvm), e.g.:\n"
            "  source ~/.nvm/nvm.sh  # if not already loaded\n"
            "  nvm install --lts\n"
            "  nvm alias default 'lts/*'\n"
        )
        sys.exit(1)

    print("[OK] Node.js version is sufficient.\n")





def run_process(cmd, cwd=None):
    return subprocess.Popen(cmd, cwd=cwd, shell=True)

def ensure_directory_exists(path):
    if not os.path.isdir(path):
        print(f"[ERROR] Directory not found: {path}")
        sys.exit(1)

def ensure_env_file(path):
    env_path = os.path.join(path, ".env")
    if not os.path.exists(env_path):
        print(f"Creating .env in {path}")
        with open(env_path, "w") as f:
            f.write('DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mockbank?schema=public"\n')

def main():
    backend_dir = "backend"    # <- CHANGE THIS if your folder is named differently
    frontend_dir = "frontend"   # <- CHANGE THIS if needed
    db_dir = "mockbank"

    ensure_directory_exists(backend_dir)
    ensure_directory_exists(frontend_dir)
    ensure_directory_exists(db_dir)

    # STEP 1 — .env setup
    ensure_env_file(backend_dir)
    ensure_env_file(db_dir)

    # STEP 2 — Install dependencies
    
    print("Installing db dependencies...")
    subprocess.run("npm install", cwd=db_dir, shell=True, check=True)

    print("Installing backend dependencies...")
    subprocess.run("npm install", cwd=backend_dir, shell=True, check=True)

    print("Installing frontend dependencies...")
    subprocess.run("npm install", cwd=frontend_dir, shell=True, check=True)
    

    # STEP 3 — Prisma migrate + seed
    print("Running Prisma migrations...")
    subprocess.run("npx prisma migrate dev --name init", cwd=db_dir, shell=True, check=True)

    print("Running Prisma seed...")
    subprocess.run("npm run seed", cwd=db_dir, shell=True, check=True)

    # STEP 4 — Start backend server
    print("Starting backend (npm run dev)...")
    database = run_process("npm run dev", cwd=db_dir)
    
    print("Starting backend (node bang)...")
    backend = run_process("node server.js", cwd=backend_dir)



    time.sleep(2)

    # STEP 5 — Start frontend
    print("Starting frontend (npm run dev)...")
    frontend = run_process("npm run dev", cwd=frontend_dir)

    print("\nMockBank + Frontend running. Press CTRL+C to stop.\n")

    try:
        database.wait()
        backend.wait()
        frontend.wait()
    except KeyboardInterrupt:
        print("\nStopping services...")
        database.terminate()
        backend.terminate()
        frontend.terminate()
        sys.exit(0)

if __name__ == "__main__":
    ensure_node_version()
    main()
