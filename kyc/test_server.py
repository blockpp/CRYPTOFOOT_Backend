import unittest
import requests
from server import app
import time
import threading


class TestServer(unittest.TestCase):
    
    def test_compareface(self):
        # URL de l'API pour la fonction compareface
        url = 'http://localhost:5000/api/compareface'

        # Envoyer une requête POST à l'API avec l'image de comparaison
        response = requests.post(url, json={"id_path": "./image/molka.jpg"})

        # Vérifier que la réponse est réussie (code d'état 200)
        self.assertEqual(response.status_code, 200)

        # Vérifier que la réponse est l'un des résultats attendus : "True", "False", "Face could not be detected!"
        self.assertIn(response.text, ["True", "False", "Face could not be detected!"])

    def test_method_not_allowed(self):
        # URL de l'API pour la fonction compareface (mais cette fois, nous enverrons une requête GET)
        url = 'http://localhost:5000/api/compareface'

        # Envoyer une requête GET à l'API
        response = requests.get(url)

        # Vérifier que la réponse est "Method Not Allowed" (code d'état 405)
        self.assertEqual(response.status_code, 405)

        # Vérifier que la réponse contient le message d'erreur "Method Not Allowed"
        expected_error_message = 'Method Not Allowed'
        self.assertIn(expected_error_message, response.text)
        pass

    def setUp(self):
        # Crée une instance du client de test Flask pour interagir avec l'application
        self.app = app.test_client()  
        pass  

    def test_face_not_detected(self):
        # URL de l'API pour la fonction compareface avec une image sans visage
        url = 'http://localhost:5000/api/compareface'
        response = requests.post(url, json={"id_path": "./image/no_face.jpg"})
        # Vérifier que la réponse contient le message d'erreur "Face could not be detected!"
        expected_error_message = 'Face could not be detected!'
        self.assertIn(expected_error_message, response.text)
    def test_compareface_missing_id_image(self):
        # Test case when the image of identity is missing in the request
        url = 'http://localhost:5000/api/compareface'
        
        # Sending a POST request without 'id_path' in the payload
        response = requests.post(url, json={})

        # Assert that the response status code is 400 (Bad Request)
        self.assertEqual(response.status_code, 200)
    def test_not_found(self):
        # Test pour vérifier que l'API renvoie une erreur 404 (Not Found)
        # lorsque l'utilisateur accède à une URL qui n'existe pas
        response = requests.get(self.base_url + '/api/non_existent_url')
        self.assertEqual(response.status_code, 404)   

    def test_invalid_image_format(self):
        # Test pour vérifier que l'API renvoie une erreur 415 (Unsupported Media Type)
        # lorsque le format d'image est incorrect (pas du format JSON)
        response = requests.post(self.base_url + '/api/compareface', data='invalid_image_data')
        self.assertEqual(response.status_code, 415)     
        
    

if __name__ == '__main__':
    unittest.main()