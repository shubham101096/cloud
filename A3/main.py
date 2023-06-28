from flask import Flask, request, app
import mysql.connector
import json

app = Flask(__name__)


def write_connector():
    try:
        connector = mysql.connector.connect(
            host='database-1.cluster-cnm0ytgqucv9.us-east-1.rds.amazonaws.com',
            user='admin',
            password='12345678',
            database='cloud_a3_db'
        )
        return connector
    except Exception as e:
        return None


def read_connector():
    try:
        connector = mysql.connector.connect(
            host='database-1.cluster-ro-cnm0ytgqucv9.us-east-1.rds.amazonaws.com',
            user='admin',
            password='12345678',
            database='cloud_a3_db'
        )
        return connector
    except Exception as e:
        return None


@app.route('/store-products', methods=['POST'])
def store_products():
    try:
        data = request.get_json()
        products = data['products']

        connector = write_connector()
        if not connector:
            return {"message": "Database connection error"}, 500

        cursor = connector.cursor()
        for product in products:
            name = product['name']
            price = product['price']
            availability = product['availability']

            insert_query = "INSERT INTO products (name, price, availability) VALUES (%s, %s, %s)"
            cursor.execute(insert_query, (name, price, availability))

        connector.commit()
        connector.close()

        return {"message": "Success."}, 200
    except KeyError:
        return {"message": "Invalid input"}, 400
    except Exception as e:
        return {"message": str(e)}, 500
    

@app.route('/list-products')
def list_products():
    try:
        connector = read_connector()
        if not connector:
            return {"message": "Database connection error"}, 500

        cursor = connector.cursor()
        select_query = "SELECT * FROM products"
        cursor.execute(select_query)
        products = cursor.fetchall()

        product_list = []
        for product in products:
            product_dict = {
                'name': product[0],
                'price': product[1],
                'availability': product[2]
            }
            product_list.append(product_dict)

        connector.close()
        return json.dumps(product_list), 200
    except Exception as e:
        return {"message": str(e)}, 500


@app.route('/', methods=['GET'])
def default():
    return "Hi"


@app.route('/create-table', methods=['POST'])
def create_table():
    connector = mysql.connector.connect(
        host='database-1.cluster-cnm0ytgqucv9.us-east-1.rds.amazonaws.com',
        user='admin',
        password='12345678',
        database='cloud_a3_db'
    )

    cursor = connector.cursor()

    create_table_query = '''
        CREATE TABLE products (
            name VARCHAR(100),
            price VARCHAR(100),
            availability BOOLEAN
        )
    '''

    cursor.execute(create_table_query)

    connector.commit()
    cursor.close()
    connector.close()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6009)