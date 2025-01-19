from flask import Flask, request, render_template, jsonify
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

    # New Route: Historical and Predicted Data for Graph
@app.route('/graph-data', methods=['GET'])
def graph_data():
    try:
        # Historical Data (2000 to 2024)
        historical_years = train_data['year'].tolist()
        historical_waste = train_data['waste'].tolist()  # Assuming 'waste' column exists in train_data

        # Predicted Data (2025 to selected year)
        selected_year = int(request.args.get('year', 2025))  # Default to 2025 if no year is provided
        predicted_years = list(range(2025, selected_year + 1))

        predicted_waste = []
        for year in predicted_years:
            future_features = pd.DataFrame({'year': [year]})
            for feature in ['population', 'gdp', 'householdMinIncome', 'death']:
                regressor = LinearRegression()
                regressor.fit(train_data[['year']], train_data[feature])
                future_features[feature] = regressor.predict(future_features[['year']])

            # Scale the features
            scaled_features = scaler_X.transform(future_features[['year', 'population', 'gdp', 'householdMinIncome', 'death']])

            # Predict waste
            scaled_prediction = model.predict(scaled_features)
            prediction = scaler_y.inverse_transform(scaled_prediction.reshape(-1, 1))[0, 0]
            predicted_waste.append(prediction)

        return jsonify({
            'historical': {
                'years': historical_years,
                'waste': historical_waste
            },
            'predicted': {
                'years': predicted_years,
                'waste': predicted_waste
            }
        })
    except Exception as e:
        print(f"Error generating graph data: {e}")
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
