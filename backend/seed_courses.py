import requests

default_courses = [
    { "name": "Office Pack", "hrs": 60, "fee": 2500, "total_fee": 3010 },
    { "name": "Office Management", "hrs": 80, "fee": 3000, "total_fee": 3600 },
    { "name": "Tally Prime and Tax Accounting", "hrs": 80, "fee": 4000, "total_fee": 4780 },
    { "name": "Python Programming", "hrs": 60, "fee": 4000, "total_fee": 4780 },
    { "name": "C & C++ Programming", "hrs": 60, "fee": 4000, "total_fee": 4780 },
    { "name": "Web Designing for Kids", "hrs": 40, "fee": 2500, "total_fee": 3010 },
    { "name": "Computer Networks and Hacking", "hrs": 80, "fee": 4000, "total_fee": 4780 },
    { "name": "CCNA Coaching", "hrs": 120, "fee": 6000, "total_fee": 7140 },
    { "name": "Design and Animation", "hrs": 30, "fee": 2500, "total_fee": 3010 },
    { "name": "3D Animation", "hrs": 30, "fee": 2500, "total_fee": 3010 },
    { "name": "Multimedia Package", "hrs": 50, "fee": 3500, "total_fee": 4190 },
    { "name": "Spoken English", "hrs": 40, "fee": 3000, "total_fee": 3600 },
    { "name": "Spoken Hindi", "hrs": 40, "fee": 3000, "total_fee": 3600 },
    { "name": "Video Editing", "hrs": 50, "fee": 3500, "total_fee": 4190 },
    { "name": "R Programming", "hrs": 60, "fee": 4000, "total_fee": 4780 },
    { "name": "Java Programming", "hrs": 60, "fee": 4000, "total_fee": 4780 },
    { "name": "Internet Operations", "hrs": 30, "fee": 2500, "total_fee": 3010 },
    { "name": "Data Science (Level -I)", "hrs": 60, "fee": 5000, "total_fee": 5960 },
    { "name": "Data Science (Level -II)", "hrs": 60, "fee": 5000, "total_fee": 5960 },
    { "name": "AutoCAD", "hrs": 60, "fee": 3000, "total_fee": 3600 },
    { "name": "Advanced Excel", "hrs": 60, "fee": 4000, "total_fee": 4780 },
    { "name": "Digital Marketing", "hrs": 60, "fee": 4000, "total_fee": 4780 }
]

for course in default_courses:
    res = requests.post("http://localhost:8000/api/courses", json=course)
    print(f"Added {course['name']} - {res.status_code}")

print("Seeding complete.")
