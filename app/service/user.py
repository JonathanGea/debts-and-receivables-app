import app.dao.user as user

def createUserDictionary(userData):
    userDict = {
        'id': userData[0],
        'name': userData[1],
        'email': userData[2],
    }
    if len(userData) > 3:
        userDict['uniqueCode'] = userData[3]
    return userDict

def getUser(creditorId):
    userData = user.getUserById(creditorId)
    if userData:
        return createUserDictionary(userData)
    return None

def getUserByUniqueCode(uniquecode):
    userData = user.getUserByUniqueCode(uniquecode)
    if userData:
        return createUserDictionary(userData)
    return None

def getUsers():
    usersData = user.getUsers()
    return [createUserDictionary(userData) for userData in usersData]