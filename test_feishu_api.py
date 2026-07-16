"""
Tests for Feishu API integration.
"""

import unittest
from unittest.mock import Mock, patch, MagicMock
import json
from feishu_api import FeishuAPI


class TestFeishuAPI(unittest.TestCase):
    """Test cases for FeishuAPI client."""
    
    def setUp(self):
        self.client = FeishuAPI("test_app_id", "test_app_secret")
    
    @patch('requests.post')
    def test_get_tenant_token(self, mock_post):
        """Test authentication and token retrieval."""
        mock_response = Mock()
        mock_response.json.return_value = {
            "code": 0,
            "tenant_access_token": "test_token_123",
            "expire": 7200
        }
        mock_response.raise_for_status = Mock()
        mock_post.return_value = mock_response
        
        token = self.client.get_tenant_token()
        
        self.assertEqual(token, "test_token_123")
        self.assertEqual(self.client.tenant_token, "test_token_123")
        mock_post.assert_called_once()
    
    @patch('requests.get')
    @patch.object(FeishuAPI, 'get_tenant_token')
    def test_get_table_records(self, mock_auth, mock_get):
        """Test fetching table records."""
        mock_auth.return_value = "test_token"
        
        mock_response = Mock()
        mock_response.json.return_value = {
            "code": 0,
            "data": {
                "items": [
                    {"record_id": "rec1", "fields": {"Name": "Book 1"}},
                    {"record_id": "rec2", "fields": {"Name": "Book 2"}}
                ]
            }
        }
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response
        
        records = self.client.get_table_records("app123", "tbl456")
        
        self.assertEqual(len(records), 2)
        self.assertEqual(records[0]["fields"]["Name"], "Book 1")
    
    @patch('requests.post')
    @patch.object(FeishuAPI, 'get_tenant_token')
    def test_create_record(self, mock_auth, mock_post):
        """Test creating a new record."""
        mock_auth.return_value = "test_token"
        
        mock_response = Mock()
        mock_response.json.return_value = {
            "code": 0,
            "data": {"record": {"record_id": "new_rec_123"}}
        }
        mock_response.raise_for_status = Mock()
        mock_post.return_value = mock_response
        
        result = self.client.create_record("app123", "tbl456", {"Name": "New Book"})
        
        self.assertEqual(result["data"]["record"]["record_id"], "new_rec_123")


if __name__ == "__main__":
    unittest.main()