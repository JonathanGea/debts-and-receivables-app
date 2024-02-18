from app import app
from app.utils.query import (
    fetchQuery,
    fetchesQuery,
    executeQuery
)
def getUsers():
    try:
        query = """
            select 
                id, name, email, unique_code
            from 
                "debts-and-receivables-app"."users" u
            order by id;
            """
        data = fetchesQuery(query)
        return data
    except Exception as e:
        print(f"Error in getUsersDao: {e}")
        return False
    
def getUserByEmail(email):
    try:
        query = """
            select 
                id, "name", email,"password", unique_code 
            from 
                "debts-and-receivables-app"."users"
            where email = %(email)s;
            """
        parameter = {'email': email}
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameter}')

        result = fetchQuery(query,parameter)
        return result
    except Exception as e:
        print(f"Error in getUserDao: {e}")
        return False
    
def getUserById(id):
    try:
        query = """
            select 
                id, name, email, password, unique_code
            from 
                 "debts-and-receivables-app"."users" 
            where id = %(id)s;
            """
        parameter = {'id': id}
        result = fetchQuery(query,parameter)
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameter}')

        return result
    except Exception as e:
        print(f"Error in getUserDao: {e}")
        return False

def getUserByUniqueCode(uniqueCode):
    try:
        query = """
            select
                id, name, email 
            from
                 "debts-and-receivables-app"."users"
            where
                unique_code = %(uniqueCode)s;
            """
        parameter = {'uniqueCode': uniqueCode}
        result = fetchQuery(query,parameter)
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameter}')

        return result
    except Exception as e:
        print(f"Error in getUserDao: {e}")
        return False

def createUsersDao(name, email, password):
    try:
        query = """
            INSERT INTO "debts-and-receivables-app"."users" (name, email, password)
            VALUES
            (%(name)s, %(email)s, %(password)s);
        """
        parameter = {'name': name, 'password': password, 'email': email}
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameter}')

        result = executeQuery(query, parameter)
        return True
    except Exception as e:
        print(f"Error in create_users_dao: {e}")
        return False