from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random

# --- Headless Chrome Setup for CI/CD or Local ---
options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 10)

# --- Jenkins Deployed App URL ---
BASE_URL = "http://16.171.182.63"

# --- Dynamic Test Data ---
random_int = random.randint(1000, 9999)
test_email = f"test{random_int}@mail.com"
test_password = "Test@1234"
test_name = f"User{random_int}"

# --------------------------------------------
# ✅ SIGNUP TEST CASES
# --------------------------------------------

def test_signup_valid():
    driver.get(f"{BASE_URL}/signup")
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Email']")))

    driver.find_element(By.CSS_SELECTOR, "input[placeholder='Name']").send_keys(test_name)
    driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys(test_email)
    driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys(test_password)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    wait.until(lambda d: "/login" in d.current_url or "login" in d.page_source.lower())
    print("[✔] Signup (valid) passed")

def test_signup_invalid_email():
    driver.get(f"{BASE_URL}/signup")
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Email']")))

    driver.find_element(By.CSS_SELECTOR, "input[placeholder='Name']").send_keys("Fake User")
    driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("notanemail")
    driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("pass123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    time.sleep(2)
    assert "invalid" in driver.page_source.lower() or "error" in driver.page_source.lower()
    print("[✔] Signup (invalid email) passed")

def test_signup_missing_fields():
    driver.get(f"{BASE_URL}/signup")
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Email']")))

    driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("")
    driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    time.sleep(2)
    assert "required" in driver.page_source.lower() or "error" in driver.page_source.lower()
    print("[✔] Signup (missing fields) passed")

# --------------------------------------------
# ✅ LOGIN TEST CASES
# --------------------------------------------

def test_login_valid():
    driver.get(f"{BASE_URL}/login")
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Email']")))

    driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys(test_email)
    driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys(test_password)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    wait.until(lambda d: "logout" in d.page_source.lower() or "dashboard" in d.page_source.lower())
    print("[✔] Login (valid) passed")

def test_login_invalid():
    driver.get(f"{BASE_URL}/login")
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Email']")))

    driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("wrong@email.com")
    driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("Wrong123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    time.sleep(2)
    assert "invalid" in driver.page_source.lower() or "error" in driver.page_source.lower()
    print("[✔] Login (invalid) passed")

# --------------------------------------------
# ✅ RUN ALL TESTS
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
