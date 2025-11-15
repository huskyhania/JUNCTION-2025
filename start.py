import subprocess
import time
import sys
import os

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
    backend_dir = "mockbank"    # <- CHANGE THIS if your folder is named differently
    frontend_dir = "frontend"   # <- CHANGE THIS if needed

    ensure_directory_exists(backend_dir)
    ensure_directory_exists(frontend_dir)

    # STEP 1 — .env setup
    ensure_env_file(backend_dir)

    # STEP 2 — Install dependencies
    print("Installing backend dependencies...")
    subprocess.run("npm install", cwd=backend_dir, shell=True, check=True)

    print("Installing frontend dependencies...")
    subprocess.run("npm install", cwd=frontend_dir, shell=True, check=True)

    # STEP 3 — Prisma migrate + seed
    print("Running Prisma migrations...")
    subprocess.run("npx prisma migrate dev --name init", cwd=backend_dir, shell=True, check=True)

    print("Running Prisma seed...")
    subprocess.run("npm run seed", cwd=backend_dir, shell=True, check=True)

    # STEP 4 — Start backend server
    print("Starting backend (npm run dev)...")
    backend = run_process("npm run dev", cwd=backend_dir)

    time.sleep(2)

    # STEP 5 — Start frontend
    print("Starting frontend (npm run dev)...")
    frontend = run_process("npm run dev", cwd=frontend_dir)

    print("\nMockBank + Frontend running. Press CTRL+C to stop.\n")

    try:
        backend.wait()
        frontend.wait()
    except KeyboardInterrupt:
        print("\nStopping services...")
        backend.terminate()
        frontend.terminate()
        sys.exit(0)

if __name__ == "__main__":
    main()
