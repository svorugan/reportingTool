from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class ReportDefinition(Base):
    __tablename__ = "report_definitions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    datasource = Column(String(100), nullable=False)
    query = Column(Text, nullable=False)
