from app import app
import psycopg2
from app.utils.credentials import *
from functools import wraps

def log_function_execution(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            # Use func.__name__ to automatically include the function name in log statements
            app.logger.info(f'Executing {func.__name__}: {args}, {kwargs}')
            result = func(*args, **kwargs)
            app.logger.info(f'{func.__name__} executed successfully. Result: {result}')
            return result
        except Exception as e:
            app.logger.error(f"Error in {func.__name__}: {e}")
            return False

    return wrapper

def getDatabaseConnection():
    conn = psycopg2.connect(
        host=HOST,
        database=DATABSE,
        user=USER_POSTGRES_DB,
        password=PASSWORD_POSTGRES_DB
    )
    return conn

def executeQuery(query, parameters=None):
    conn = getDatabaseConnection()
    cur = conn.cursor()
    success = True
    try:
        if parameters:
            cur.execute(query, parameters)
        else:
            cur.execute(query)
        conn.commit()
    except Exception as e:
        print(f"Error executing query: {e}")
        conn.rollback()
        success = False
    finally:
        cur.close()
        conn.close()

    return success

def executeQueryWithReturn(query, parameters=None):
    conn = getDatabaseConnection()
    cur = conn.cursor()
    data = ""
    try:
        if parameters:
            cur.execute(query, parameters)
        else:
            cur.execute(query)
        data = cur.fetchone()[0] 
        print("data :", data)
        conn.commit()
    except Exception as e:
        print(f"Error executing query: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()
    return data

def fetchesQuery(query, parametereters=None):
    conn = getDatabaseConnection()
    cur = conn.cursor()

    try:
        if parametereters:
            cur.execute(query, parametereters)
        else:
            cur.execute(query)

        data = cur.fetchall()
    except Exception as e:
        print(f"Error executing query: {e}")
        data = None
    finally:
        cur.close()
        conn.close()

    return data


def fetchQuery(query, parametereters=None):
    conn = getDatabaseConnection()
    cur = conn.cursor()

    try:
        if parametereters:
            cur.execute(query, parametereters)
        else:
            cur.execute(query)

        data = cur.fetchone()
    except Exception as e:
        print(f"Error executing query: {e}")
        data = None
    finally:
        cur.close()
        conn.close()

    return data