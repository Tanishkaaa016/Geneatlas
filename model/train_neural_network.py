from pathlib import Path
import joblib
import pandas as pd
import tensorflow as tf

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler

DATA = Path("data/processed")
MODEL_DIR = Path("saved_models")

MODEL_DIR.mkdir(exist_ok=True)

print("=" * 60)
print("GeneAtlas Deep Neural Network")
print("=" * 60)

# -------------------------------------------------
# Load Data
# -------------------------------------------------

X = pd.read_csv(DATA / "X_selected.csv")
y = pd.read_csv(DATA / "y.csv").squeeze()

print("Features:", X.shape)
print("Labels:", y.shape)

# -------------------------------------------------
# Encode Labels
# -------------------------------------------------

encoder = LabelEncoder()

y = encoder.fit_transform(y)

joblib.dump(
    encoder,
    MODEL_DIR / "label_encoder.pkl"
)

# -------------------------------------------------
# Split
# -------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# -------------------------------------------------
# Scale
# -------------------------------------------------

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

joblib.dump(
    scaler,
    MODEL_DIR / "scaler.pkl"
)

# -------------------------------------------------
# Model
# -------------------------------------------------

model = tf.keras.Sequential([

    tf.keras.layers.Input(shape=(X_train.shape[1],)),

    tf.keras.layers.Dense(
        1024,
        activation="relu"
    ),

    tf.keras.layers.BatchNormalization(),

    tf.keras.layers.Dropout(0.4),

    tf.keras.layers.Dense(
        512,
        activation="relu"
    ),

    tf.keras.layers.BatchNormalization(),

    tf.keras.layers.Dropout(0.3),

    tf.keras.layers.Dense(
        256,
        activation="relu"
    ),

    tf.keras.layers.Dropout(0.2),

    tf.keras.layers.Dense(
        len(encoder.classes_),
        activation="softmax"
    )

])

model.compile(

    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.001
    ),

    loss="sparse_categorical_crossentropy",

    metrics=["accuracy"]

)

model.summary()

# -------------------------------------------------
# Callbacks
# -------------------------------------------------

early_stop = tf.keras.callbacks.EarlyStopping(

    monitor="val_loss",

    patience=10,

    restore_best_weights=True

)

checkpoint = tf.keras.callbacks.ModelCheckpoint(

    MODEL_DIR / "geneatlas_model.keras",

    save_best_only=True

)

# -------------------------------------------------
# Train
# -------------------------------------------------

history = model.fit(

    X_train,

    y_train,

    validation_split=0.2,

    epochs=100,

    batch_size=32,

    callbacks=[

        early_stop,

        checkpoint

    ],

    verbose=1

)

# -------------------------------------------------
# Evaluate
# -------------------------------------------------

loss, accuracy = model.evaluate(

    X_test,

    y_test,

    verbose=0

)

print()

print("=" * 60)

print("Test Accuracy")

print("=" * 60)

print(accuracy)