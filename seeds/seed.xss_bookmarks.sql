INSERT INTO bookmark_reviews (id, bookmark_name, bookmark_desc, bookmark_website)
VALUES
  (911, 'Injection post!', 'How-to',
    'This text contains an intentionally broken image 
    <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie); 
    alert(''you just got pretend hacked! oh noes!'');">. 
    The image will try to load, when it fails, 
    <strong>it executes malicious JavaScript</strong>');