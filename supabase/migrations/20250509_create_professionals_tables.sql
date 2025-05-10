-- Create professionals table
CREATE TABLE professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    specialty VARCHAR(50),
    gender VARCHAR(10),
    address TEXT,
    profile_picture_url TEXT,
    average_rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID REFERENCES professionals(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create client reviews table
CREATE TABLE client_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID REFERENCES professionals(id),
    client_id UUID REFERENCES auth.users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create professional photos table
CREATE TABLE professional_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID REFERENCES professionals(id),
    photo_url TEXT NOT NULL,
    description TEXT,
    is_client_photo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID REFERENCES professionals(id),
    client_id UUID REFERENCES auth.users(id),
    service_id UUID REFERENCES services(id),
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    price DECIMAL(10,2),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES auth.users(id),
    receiver_id UUID REFERENCES auth.users(id),
    message TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create search filters table
CREATE TABLE search_filters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID REFERENCES professionals(id),
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    location TEXT,
    gender_preference VARCHAR(10),
    specialty VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create RLS policies
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_filters ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Professionals can view their own data"
    ON professionals
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Professionals can update their own data"
    ON professionals
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Professionals can view their own services"
    ON services
    FOR SELECT
    USING (auth.uid() = (SELECT user_id FROM professionals WHERE id = professional_id));

CREATE POLICY "Professionals can create services"
    ON services
    FOR INSERT
    WITH CHECK (auth.uid() = (SELECT user_id FROM professionals WHERE id = professional_id));

CREATE POLICY "Clients can view professionals"
    ON professionals
    FOR SELECT
    USING (true);

CREATE POLICY "Clients can create reviews"
    ON client_reviews
    FOR INSERT
    WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Professionals can view their own reviews"
    ON client_reviews
    FOR SELECT
    USING (auth.uid() = (SELECT user_id FROM professionals WHERE id = professional_id));

CREATE POLICY "Professionals can view their own photos"
    ON professional_photos
    FOR SELECT
    USING (auth.uid() = (SELECT user_id FROM professionals WHERE id = professional_id));

CREATE POLICY "Professionals can upload photos"
    ON professional_photos
    FOR INSERT
    WITH CHECK (auth.uid() = (SELECT user_id FROM professionals WHERE id = professional_id));

CREATE POLICY "Professionals can view their own appointments"
    ON appointments
    FOR SELECT
    USING (auth.uid() = professional_id);

CREATE POLICY "Clients can view their own appointments"
    ON appointments
    FOR SELECT
    USING (auth.uid() = client_id);

CREATE POLICY "Professionals can create appointments"
    ON appointments
    FOR INSERT
    WITH CHECK (auth.uid() = professional_id);

CREATE POLICY "Clients can send messages"
    ON messages
    FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view their own messages"
    ON messages
    FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
