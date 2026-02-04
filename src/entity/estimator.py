import os
import sys

from src.exception import MyException
from src.logger import logging


class MyModel:
    """
    Custom model class for wrapping sklearn models with preprocessing.
    """
    
    def __init__(self, preprocessing_object, trained_model_object):
        """
        Initialize the model with preprocessing and trained model objects.
        
        Parameters:
        -----------
        preprocessing_object : object
            Preprocessing pipeline or transformer
        trained_model_object : object
            Trained sklearn model
        """
        self.preprocessing_object = preprocessing_object
        self.trained_model_object = trained_model_object

    def predict(self, X):
        """
        Make predictions on input data.
        
        Parameters:
        -----------
        X : array-like
            Input features
            
        Returns:
        --------
        array
            Predictions
        """
        try:
            logging.info("Entered predict method of MyModel class")
            transformed_feature = self.preprocessing_object.transform(X)
            logging.info("Used the trained model to get predictions")
            return self.trained_model_object.predict(transformed_feature)
        except Exception as e:
            raise MyException(e, sys)

    def __repr__(self):
        return f"{type(self.trained_model_object).__name__}()"

    def __str__(self):
        return f"{type(self.trained_model_object).__name__}()"
