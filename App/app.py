from flask import Flask, request, render_template
import joblib
import pandas as pd
from sklearn.linear_model import LinearRegression

# Load the pre-trained model and scalers
model = joblib.load('models/svr_model.pkl')
scaler_X = joblib.load('models/scaler_X.pkl')
scaler_y = joblib.load('models/scaler_y.pkl')

# Load the training data
train_data = pd.read_csv('data/cloneData.csv')
train_data = train_data[train_data['year'].between(2000, 2024)]  # Filter training range

# Initialize Flask app
app = Flask(__name__)

# Route for the homepage
@app.route('/')
def home():
    return render_template('index.html')

# Route for handling predictions
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input year from the form
        year = int(request.form['years'])

        # Check if year is within the range
        if year < 2000 or year > 2200:
            return render_template('index.html', prediction="Year must be between 2000 and 2200.", target_year=year)

        # Predict features for the input year using Linear Regression
        future_features = pd.DataFrame({'year': [year]})
        for feature in ['population', 'gdp', 'householdMinIncome', 'death']:
            regressor = LinearRegression()
            regressor.fit(train_data[['year']], train_data[feature])
            future_features[feature] = regressor.predict(future_features[['year']])

        # Scale the features
        scaled_features = scaler_X.transform(future_features[['year', 'population', 'gdp', 'householdMinIncome', 'death']])

        # Predict waste for the given year
        scaled_prediction = model.predict(scaled_features)
        prediction = scaler_y.inverse_transform(scaled_prediction.reshape(-1, 1))[0, 0]

        return render_template('index.html', prediction=f" {prediction:.2f}", target_year=year)
    except Exception as e:
        print(f"Error: {e}")  # Debug print
        return render_template('index.html', prediction=f"Error: {str(e)}", target_year=None)

if __name__ == '__main__':
    app.run(debug=True)
