from hostel_chef.app import app

# Vercel needs a variable named 'app' (or whatever you configure, but 'app' is standard)
# This file adapts the WSGI app for Vercel
app = app
