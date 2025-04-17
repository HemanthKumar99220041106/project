import subprocess
import time
from datetime import datetime
import os

# Get the absolute path of the current script
REPO_DIR = os.path.dirname(os.path.abspath(__file__))

# Function to run a shell command and return output
def run_command(command):
    result = subprocess.run(command, shell=True, cwd=REPO_DIR, capture_output=True, text=True)
    return result.stdout.strip()

# Function to check and push changes
def check_and_push_changes():
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"[{current_time}] Checking for changes...")

    # Check if any files have been changed
    status_output = run_command("git status --porcelain")

    if status_output:
        print(f"[{current_time}] Changes detected:\n{status_output}")

        # Stage all changes
        run_command("git add .")
        print(f"[{current_time}] Changes staged.")

        # Commit with timestamp
        commit_message = f"Auto commit at {current_time}"
        run_command(f'git commit -m "{commit_message}"')
        print(f"[{current_time}] Committed changes.")

        # Push to remote
        push_output = run_command("git push")
        print(f"[{current_time}] Pushed to remote.")
    else:
        print(f"[{current_time}] No changes detected.\n")

# Run every 10 minutes
if __name__ == "__main__":
    print("🔁 Auto Git Push script started. Press Ctrl+C to stop.\n")
    while True:
        check_and_push_changes()
        time.sleep(600)  # 10 minutes
