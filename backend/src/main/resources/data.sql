-- Insert dummy resources only if the table is empty (prevents duplicate errors on restart)
INSERT INTO resources (name, location) 
SELECT 'Lecture Hall A', 'Main Building' 
WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'Lecture Hall A');

INSERT INTO resources (name, location) 
SELECT 'Computer Lab 204', 'Engineering Building' 
WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'Computer Lab 204');

INSERT INTO resources (name, location) 
SELECT 'Meeting Room B', 'Science Block' 
WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'Meeting Room B');

INSERT INTO resources (name, location) 
SELECT 'Sony 4K Projector', 'IT Store Room' 
WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'Sony 4K Projector');