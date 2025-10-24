#!/usr/bin/env python3
"""
Test script to verify Hugging Face deployment is working
"""

import requests
import json
import time

def test_huggingface_deployment():
    """Test the Hugging Face API deployment"""
    
    # Your Hugging Face Space URL
    base_url = "https://ali578-humanizer-api.hf.space"
    
    print("🧪 Testing Hugging Face API Deployment...")
    print(f"📍 Base URL: {base_url}")
    print("-" * 50)
    
    # Test 1: Health Check
    print("1️⃣ Testing Health Check...")
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health Check: {data.get('status', 'unknown')}")
            print(f"   Message: {data.get('message', 'No message')}")
        else:
            print(f"❌ Health Check Failed: HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ Health Check Error: {str(e)}")
    
    print()
    
    # Test 2: Root Endpoint
    print("2️⃣ Testing Root Endpoint...")
    try:
        response = requests.get(f"{base_url}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Root Endpoint: {data.get('status', 'unknown')}")
        else:
            print(f"❌ Root Endpoint Failed: HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ Root Endpoint Error: {str(e)}")
    
    print()
    
    # Test 3: Text Transformation
    print("3️⃣ Testing Text Transformation...")
    try:
        test_data = {
            "text": "I don't think this will work, but let's try it anyway.",
            "use_passive": False,
            "use_synonyms": False
        }
        
        response = requests.post(
            f"{base_url}/api/transform", 
            json=test_data,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Text Transformation: SUCCESS")
            print(f"   Original: {data.get('original_text', 'N/A')}")
            print(f"   Transformed: {data.get('transformed_text', 'N/A')}")
            print(f"   Transformations: {data.get('transformations_applied', [])}")
            print(f"   Processing Time: {data.get('processing_time', 0):.2f}s")
        else:
            print(f"❌ Text Transformation Failed: HTTP {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Text Transformation Error: {str(e)}")
    
    print()
    
    # Test 4: API Features
    print("4️⃣ Testing API Features...")
    try:
        response = requests.get(f"{base_url}/api/features", timeout=10)
        if response.status_code == 200:
            data = response.json()
            features = data.get('features', [])
            print(f"✅ API Features: {len(features)} features available")
            for feature in features[:2]:  # Show first 2 features
                print(f"   - {feature.get('name', 'Unknown')}: {feature.get('description', 'No description')}")
        else:
            print(f"❌ API Features Failed: HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ API Features Error: {str(e)}")
    
    print()
    
    # Test 5: Stripe Endpoint (if available)
    print("5️⃣ Testing Stripe Integration...")
    try:
        test_stripe_data = {
            "price_id": "price_test_123",
            "user_id": "test_user_123",
            "user_email": "test@example.com",
            "tier": "pro"
        }
        
        response = requests.post(
            f"{base_url}/api/create-checkout-session",
            json=test_stripe_data,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Stripe Integration: Available")
        elif response.status_code == 500:
            print("⚠️ Stripe Integration: Configured but may have issues")
        else:
            print(f"⚠️ Stripe Integration: HTTP {response.status_code} (may be expected)")
    except Exception as e:
        print(f"⚠️ Stripe Integration: {str(e)}")
    
    print()
    print("🏁 Testing Complete!")
    print("=" * 50)

if __name__ == "__main__":
    test_huggingface_deployment()
