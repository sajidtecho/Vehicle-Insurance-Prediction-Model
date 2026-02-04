import os
import sys
import yaml
import dill
import numpy as np

from src.exception import MyException
from src.logger import logging


def read_yaml_file(file_path: str) -> dict:
    """
    Read a YAML file and return its contents as a dictionary.
    
    Parameters:
    -----------
    file_path : str
        Path to the YAML file
        
    Returns:
    --------
    dict
        Contents of the YAML file
    """
    try:
        with open(file_path, "rb") as yaml_file:
            return yaml.safe_load(yaml_file)
    except Exception as e:
        raise MyException(e, sys)


def save_numpy_array_data(file_path: str, array: np.ndarray):
    """
    Save numpy array data to file.
    
    Parameters:
    -----------
    file_path : str
        Path where to save the file
    array : np.ndarray
        Numpy array to save
    """
    try:
        dir_path = os.path.dirname(file_path)
        os.makedirs(dir_path, exist_ok=True)
        with open(file_path, "wb") as file_obj:
            np.save(file_obj, array)
    except Exception as e:
        raise MyException(e, sys)


def load_numpy_array_data(file_path: str) -> np.ndarray:
    """
    Load numpy array data from file.
    
    Parameters:
    -----------
    file_path : str
        Path to the numpy file
        
    Returns:
    --------
    np.ndarray
        Loaded numpy array
    """
    try:
        with open(file_path, "rb") as file_obj:
            return np.load(file_obj)
    except Exception as e:
        raise MyException(e, sys)


def save_object(file_path: str, obj: object) -> None:
    """
    Save a Python object using dill.
    
    Parameters:
    -----------
    file_path : str
        Path where to save the object
    obj : object
        Python object to save
    """
    try:
        logging.info("Entered the save_object method of utils")
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "wb") as file_obj:
            dill.dump(obj, file_obj)
        logging.info("Exited the save_object method of utils")
    except Exception as e:
        raise MyException(e, sys)


def load_object(file_path: str) -> object:
    """
    Load a Python object using dill.
    
    Parameters:
    -----------
    file_path : str
        Path to the saved object file
        
    Returns:
    --------
    object
        Loaded Python object
    """
    try:
        if not os.path.exists(file_path):
            raise Exception(f"The file: {file_path} does not exist")
        with open(file_path, "rb") as file_obj:
            return dill.load(file_obj)
    except Exception as e:
        raise MyException(e, sys)
