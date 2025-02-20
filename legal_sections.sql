use legal_sections;
CREATE TABLE LegalSections (
    SectionNumber  VARCHAR(10) PRIMARY KEY,
    SectionTitle VARCHAR(255) NOT NULL,
    SectionDescription TEXT,
    Punishment TEXT,
    Fine TEXT,
    BailableOrNot VARCHAR(255),
    RelevantSections TEXT
);

ALTER TABLE LegalSections ADD COLUMN SortIndex INT FIRST;

alter table legalsections drop column RelevantSections;

alter table legalsections add column Illustrations TEXT after sectiondescription;

select*from legalsections order by sortindex;
