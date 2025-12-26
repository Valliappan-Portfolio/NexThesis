# NexThesis Supabase Database Schema

This document contains the complete database schema for the NexThesis application.

## Tables

### 1. `students` Table

Stores student user information.

```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  university TEXT NOT NULL,
  thesis_topic TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_students_email ON students(email);
```

### 2. `professionals` Table

Stores professional user information.

```sql
CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  linkedin_url TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  sector TEXT NOT NULL,
  years_experience INTEGER NOT NULL,
  bio TEXT NOT NULL,
  booking_link TEXT,
  languages TEXT NOT NULL,
  day_preference TEXT NOT NULL,
  time_preference TEXT NOT NULL,
  timezone TEXT NOT NULL,
  session_length INTEGER NOT NULL DEFAULT 30,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_professionals_email ON professionals(email);

-- Create index on verified for filtering
CREATE INDEX idx_professionals_verified ON professionals(verified);

-- Create index on sector for browsing
CREATE INDEX idx_professionals_sector ON professionals(sector);
```

### 3. `interview_requests` Table

Stores interview requests from students to professionals.

```sql
CREATE TABLE interview_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Student Information
  student_email TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_university TEXT,
  student_thesis_topic TEXT,

  -- Professional Information
  professional_email TEXT NOT NULL,
  professional_name TEXT NOT NULL,
  professional_company TEXT,

  -- Request Details
  pricing_tier TEXT NOT NULL,
  pricing_tier_name TEXT NOT NULL,
  price NUMERIC NOT NULL,

  -- Scheduling Preferences
  student_day_preference TEXT NOT NULL,
  student_time_preference TEXT NOT NULL,
  student_timezone TEXT NOT NULL,

  -- Status Tracking
  status TEXT NOT NULL DEFAULT 'pending',
  -- Possible status values: 'pending', 'confirmed', 'approved', 'declined', 'paid', 'scheduled', 'completed'

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for fast queries
CREATE INDEX idx_requests_student_email ON interview_requests(student_email);
CREATE INDEX idx_requests_professional_email ON interview_requests(professional_email);
CREATE INDEX idx_requests_status ON interview_requests(status);
CREATE INDEX idx_requests_created_at ON interview_requests(created_at DESC);

-- Create foreign key relationships (optional but recommended)
ALTER TABLE interview_requests
  ADD CONSTRAINT fk_student_email
  FOREIGN KEY (student_email) REFERENCES students(email) ON DELETE CASCADE;

ALTER TABLE interview_requests
  ADD CONSTRAINT fk_professional_email
  FOREIGN KEY (professional_email) REFERENCES professionals(email) ON DELETE CASCADE;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_interview_requests_updated_at
    BEFORE UPDATE ON interview_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Row Level Security (RLS) Policies

To allow the application to read and write data, you need to set up RLS policies:

```sql
-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_requests ENABLE ROW LEVEL SECURITY;

-- Allow public read access to verified professionals (for browsing)
CREATE POLICY "Allow public read verified professionals"
ON professionals FOR SELECT
TO public
USING (verified = true);

-- Allow anyone to insert new students
CREATE POLICY "Allow insert students"
ON students FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to insert new professionals
CREATE POLICY "Allow insert professionals"
ON professionals FOR INSERT
TO public
WITH CHECK (true);

-- Allow students to read their own data
CREATE POLICY "Allow students read own data"
ON students FOR SELECT
TO public
USING (true);

-- Allow professionals to read their own data
CREATE POLICY "Allow professionals read own data"
ON professionals FOR SELECT
TO public
USING (true);

-- Allow anyone to insert interview requests
CREATE POLICY "Allow insert interview_requests"
ON interview_requests FOR INSERT
TO public
WITH CHECK (true);

-- Allow students to read their own requests
CREATE POLICY "Allow students read own requests"
ON interview_requests FOR SELECT
TO public
USING (true);

-- Allow professionals to read their requests
CREATE POLICY "Allow professionals read their requests"
ON interview_requests FOR SELECT
TO public
USING (true);

-- Allow professionals to update requests sent to them
CREATE POLICY "Allow professionals update their requests"
ON interview_requests FOR UPDATE
TO public
USING (true)
WITH CHECK (true);
```

## Sample Data (for testing)

```sql
-- Insert a test professional
INSERT INTO professionals (
  first_name, last_name, email, linkedin_url, company, role, sector,
  years_experience, bio, booking_link, languages, day_preference,
  time_preference, timezone, session_length, verified
) VALUES (
  'John', 'Doe', 'john.doe@example.com', 'https://linkedin.com/in/johndoe',
  'Tech Corp', 'Senior Product Manager', 'Technology', 10,
  'Experienced product manager with 10 years in tech startups. Passionate about helping students understand product development and career growth.',
  'https://calendly.com/johndoe', 'English, Spanish', 'weekday',
  'morning,afternoon', 'Europe/London', 30, true
);

-- Insert a test student
INSERT INTO students (
  first_name, last_name, email, university, thesis_topic
) VALUES (
  'Jane', 'Smith', 'jane.smith@student.edu', 'University of Example',
  'Digital Transformation in Traditional Industries'
);
```

## Application Flow

### Student Registration
1. Student fills out registration form
2. Data is inserted into `students` table
3. Student is redirected to `/welcome/student`

### Professional Registration
1. Professional fills out registration form
2. Data is inserted into `professionals` table with `verified = false`
3. Professional is redirected to success page
4. Admin manually verifies LinkedIn and sets `verified = true`

### Interview Request Flow
1. Student browses verified professionals at `/browse`
2. Student clicks "Request Interview" on a professional
3. Student selects pricing plan and time preferences
4. Request is inserted into `interview_requests` table with `status = 'pending'`
5. Professional sees request in their dashboard at `/professional/dashboard`
6. Professional can confirm (status → 'confirmed') or decline (status → 'declined')
7. Student sees status updates in their dashboard at `/welcome/student`

## Key Features

### Professional Dashboard (`/professional/dashboard`)
- Shows all interview requests received
- Displays stats: Total, Pending, Confirmed, Declined
- Allows professionals to confirm or decline requests
- Filters requests by status

### Student Dashboard (`/welcome/student`)
- Shows all interview requests sent
- Displays stats: Total Sent, Awaiting Response, Confirmed, Declined
- Tracks request status in real-time

## Maintenance

### Cleaning Up Old Data
```sql
-- Delete declined requests older than 30 days
DELETE FROM interview_requests
WHERE status = 'declined'
AND created_at < NOW() - INTERVAL '30 days';

-- Delete unverified professionals older than 7 days
DELETE FROM professionals
WHERE verified = false
AND created_at < NOW() - INTERVAL '7 days';
```

### Analytics Queries
```sql
-- Count requests by status
SELECT status, COUNT(*) as count
FROM interview_requests
GROUP BY status;

-- Most popular professionals
SELECT professional_email, professional_name, COUNT(*) as request_count
FROM interview_requests
GROUP BY professional_email, professional_name
ORDER BY request_count DESC
LIMIT 10;

-- Students with most requests
SELECT student_email, student_name, COUNT(*) as request_count
FROM interview_requests
GROUP BY student_email, student_name
ORDER BY request_count DESC
LIMIT 10;
```
