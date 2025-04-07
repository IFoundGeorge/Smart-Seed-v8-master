import hashlib

# Given hash-like string
hash_string = "3c5e1f8e9e8c3b6b8f8b5e5f8e8c3b6b8f8b5e5f"

# Common hash algorithms and their lengths
hash_algorithms = {
    "MD5": 32,
    "SHA-1": 40,
    "SHA-224": 56,
    "SHA-256": 64,
    "SHA-384": 96,
    "SHA-512": 128
}

# Check possible matching algorithm by length
matching_algorithms = [algo for algo, length in hash_algorithms.items() if len(hash_string) == length]

matching_algorithms
