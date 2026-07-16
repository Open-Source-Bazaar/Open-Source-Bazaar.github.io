"""
Feishu (Lark) API integration for Open Source Bazaar.
Issue: https://github.com/Open-Source-Bazaar/Open-Source-Bazaar.github.io/issues/96
"""

import requests
import json
from typing import Dict, List, Optional


class FeishuAPI:
    """Client for Feishu multidimensional table API."""
    
    BASE_URL = "https://open.feishu.cn/open-apis"
    
    def __init__(self, app_id: str, app_secret: str):
        self.app_id = app_id
        self.app_secret = app_secret
        self.tenant_token = None
    
    def get_tenant_token(self) -> str:
        """Authenticate and get tenant access token."""
        url = f"{self.BASE_URL}/auth/v3/tenant_access_token/internal"
        headers = {"Content-Type": "application/json"}
        data = {
            "app_id": self.app_id,
            "app_secret": self.app_secret
        }
        
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        
        result = response.json()
        self.tenant_token = result.get("tenant_access_token")
        return self.tenant_token
    
    def get_headers(self) -> Dict[str, str]:
        """Get authenticated headers for API requests."""
        if not self.tenant_token:
            self.get_tenant_token()
        
        return {
            "Authorization": f"Bearer {self.tenant_token}",
            "Content-Type": "application/json"
        }
    
    def get_table_records(self, app_token: str, table_id: str) -> List[Dict]:
        """Fetch records from a multidimensional table."""
        url = f"{self.BASE_URL}/bitable/v1/apps/{app_token}/tables/{table_id}/records"
        headers = self.get_headers()
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        return response.json().get("data", {}).get("items", [])
    
    def create_record(self, app_token: str, table_id: str, fields: Dict) -> Dict:
        """Create a new record in the table."""
        url = f"{self.BASE_URL}/bitable/v1/apps/{app_token}/tables/{table_id}/records"
        headers = self.get_headers()
        
        data = {"fields": fields}
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        
        return response.json()
    
    def update_record(self, app_token: str, table_id: str, record_id: str, fields: Dict) -> Dict:
        """Update an existing record."""
        url = f"{self.BASE_URL}/bitable/v1/apps/{app_token}/tables/{table_id}/records/{record_id}"
        headers = self.get_headers()
        
        data = {"fields": fields}
        response = requests.put(url, headers=headers, json=data)
        response.raise_for_status()
        
        return response.json()


def main():
    """Example usage."""
    # Configuration (should be loaded from environment variables)
    import os
    app_id = os.getenv("FEISHU_APP_ID", "")
    app_secret = os.getenv("FEISHU_APP_SECRET", "")
    
    if not app_id or not app_secret:
        print("Please set FEISHU_APP_ID and FEISHU_APP_SECRET environment variables")
        return
    
    client = FeishuAPI(app_id, app_secret)
    
    # Example: Get records from a table
    # records = client.get_table_records("app_token_here", "table_id_here")
    # print(json.dumps(records, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()