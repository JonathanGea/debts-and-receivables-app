from app.utils.query import (
    getDatabaseConnection,
    fetchQuery,
    fetchesQuery,
    executeQuery
)
def getUserDao(id):
    try:
        query = """
            select 
                id, name, email
            from 
                "debt"."user" u 
            where id = %(id)s;
            """
        parameter = {'id': id}
        result = fetchQuery(query,parameter)
        return result
    except Exception as e:
        print(f"Error in getUserDao: {e}")
        return False

def getUsersDao():
    try:
        query = """
            select 
                id, name, email 
            from 
                "debt"."user" u
            order by id;
            """
        data = fetchesQuery(query)
        return data
    except Exception as e:
        print(f"Error in getUsersDao: {e}")
        return False

def createUsersDao(name, email):
    try:
        query = """
            INSERT INTO "debt"."user" (name, email)
            VALUES
            (%(name)s, %(email)s);
        """
        parametereters = {'name': name, 'email': email}
        executeQuery(query, parametereters)
        return True
    except Exception as e:
        print(f"Error in create_users_dao: {e}")
        return False

def deleteUserDao(id):
    conn = getDatabaseConnection()
    cur = conn.cursor()
    query = """
        DELETE FROM 
            "debt"."user"
        WHERE 
            id = %(id)s;
    """
    
    parametereters = {'id': id}
    cur.execute(query, parametereters)
    print(query)
    conn.commit()
    cur.close()
    conn.close()
    return True


def updateUserDao(id, name, email):
    conn = getDatabaseConnection()
    cur = conn.cursor()
    query = """
    UPDATE "debt"."user" 
    SET name  = %s , email  = %s
    WHERE id = %s;
    """
    cur.execute(query, (name, email, id))
    conn.commit()
    cur.close()
    conn.close()
    return True