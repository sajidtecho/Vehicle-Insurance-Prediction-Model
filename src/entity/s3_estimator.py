import sys

from src.cloud_storage.aws_storage import SimpleStorageService
from src.exception import MyException
from src.logger import logging


class Proj1Estimator:
    """
    This class is used to save and load models from S3 bucket for making predictions.
    """

    def __init__(self, bucket_name, model_path):
        """
        Initialize the estimator with S3 bucket information.
        
        Parameters:
        -----------
        bucket_name : str
            Name of the S3 bucket
        model_path : str
            Path to the model in the S3 bucket
        """
        self.bucket_name = bucket_name
        self.s3 = SimpleStorageService()
        self.model_path = model_path
        self.loaded_model = None

    def is_model_present(self, model_path):
        """
        Check if model exists in S3.
        
        Parameters:
        -----------
        model_path : str
            Path to check in S3
            
        Returns:
        --------
        bool
            True if model exists, False otherwise
        """
        try:
            return self.s3.s3_key_path_available(bucket_name=self.bucket_name, s3_key=model_path)
        except MyException as e:
            logging.error(f"Error checking if model is present: {str(e)}")
            return False

    def load_model(self):
        """
        Load the model from S3.
        
        Returns:
        --------
        object
            Loaded model object
        """
        try:
            logging.info(f"Loading model from {self.model_path}")
            return self.s3.load_model(self.model_path, bucket_name=self.bucket_name)
        except Exception as e:
            raise MyException(e, sys)

    def save_model(self, from_file, remove: bool = False):
        """
        Save model to S3.
        
        Parameters:
        -----------
        from_file : str
            Local path to the model file
        remove : bool
            Whether to remove local file after upload
        """
        try:
            self.s3.upload_file(
                from_filename=from_file,
                to_filename=self.model_path,
                bucket_name=self.bucket_name,
                remove=remove,
            )
        except Exception as e:
            raise MyException(e, sys)

    def predict(self, dataframe):
        """
        Make predictions using the loaded model.
        
        Parameters:
        -----------
        dataframe : pd.DataFrame
            Input data for predictions
            
        Returns:
        --------
        array
            Model predictions
        """
        try:
            if self.loaded_model is None:
                self.loaded_model = self.load_model()
            return self.loaded_model.predict(dataframe)
        except Exception as e:
            raise MyException(e, sys)

    def __del__(self):
        """Cleanup when object is destroyed."""
        logging.info(f"{self.__class__.__name__} object destroyed")
