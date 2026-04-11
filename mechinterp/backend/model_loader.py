from transformer_lens import HookedTransformer
import threading

class ModelLoader:
    _instance = None
    _lock = threading.Lock()
    _model = None

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance

    @classmethod
    def get_model(cls):
        if cls._model is None:
            print("[ModelLoader] Loading GPT-2 Small...")
            cls._model = HookedTransformer.from_pretrained("gpt2")
            print("[ModelLoader] Model ready.")
        return cls._model
