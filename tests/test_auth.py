from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import random

# --- Setup Chrome in headless mode ---
options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(options=options)

# --- Your Deployed Site URL ---
BASE_URL = "http://<your-ec2-ip>:3000"  # Replace with your actual URL

# --- Generate Random Test Data ---
random_int = random.randint(1000, 9999)
test_email = f"test{random_int}@mail.com"
test_password = "Test@1234"
test_name = f"User{random_int}"

# --------------------------------------------
# ✅ SIGNUP TEST CASES
# --------------------------------------------

def test_signup_valid():
    driver.get(f"{BASE_URL}/signup")
    time.sleep(1)
    driver.find_element(By.NAME, "name").send_keys(test_name)
    driver.find_element(By.NAME, "email").send_keys(test_email)
    driver.find_element(By.NAME, "password").send_keys(test_password)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(3)
    assert "login" in driver.current_url.lower() or "success" in driver.page_source.lower()
    print("[✔] Signup (valid) passed")

def test_signup_invalid_email():
    driver.get(f"{BASE_URL}/signup")
    time.sleep(1)
    driver.find_element(By.NAME, "name").send_keys("Test User")
    driver.find_element(By.NAME, "email").send_keys("not-an-email")
    driver.find_element(By.NAME, "password").send_keys(test_password)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(2)
    assert "invalid" in driver.page_source.lower() or "error" in driver.page_source.lower()
    print("[✔] Signup (invalid email) passed")

def test_signup_missing_fields():
    driver.get(f"{BASE_URL}/signup")
    time.sleep(1)
    driver.find_element(By.NAME, "email").send_keys("")  # Missing email
    driver.find_element(By.NAME, "password").send_keys("")  # Missing password
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(2)
    assert "required" in driver.page_source.lower() or "error" in driver.page_source.lower()
    print("[✔] Signup (missing fields) passed")

# --------------------------------------------
# ✅ LOGIN TEST CASES
# --------------------------------------------

def test_login_valid():
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)
    driver.find_element(By.NAME, "email").send_keys(test_email)
    driver.find_element(By.NAME, "password").send_keys(test_password)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(3)
    assert "dashboard" in driver.page_source.lower() or "logout" in driver.page_source.lower()
    print("[✔] Login (valid) passed")

def test_login_invalid():
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)
    driver.find_element(By.NAME, "email").send_keys("wrong@mail.com")
    driver.find_element(By.NAME, "password").send_keys("wrongpassword")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(2)
    assert "invalid" in driver.page_source.lower() or "error" in driver.page_source.lower()
    print("[✔] Login (invalid) passed")

# --------------------------------------------
# ✅ Run All Tests
# --------------------------------------------

if __name__ == "__main__":
    try:
        test_signup_valid()
        test_signup_invalid_email()
        test_signup_missing_fields()
        test_login_valid()
        test_login_invalid()
    finally:
        driver.quit()
