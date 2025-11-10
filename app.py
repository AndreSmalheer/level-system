from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html', user = None, tasks = None)


@app.route("/api/add", methods=["POST"])
def add_item():
    data_type = request.form.get("type")

    print(f"Adding new item of type: {data_type}")
    return jsonify("Item added", 200)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
