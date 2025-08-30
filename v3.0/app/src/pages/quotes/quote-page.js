import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import Loading from "../../components/Loading";
import { ROUTES } from "../../constants/index.ts";
import { useAppState } from "../../state/stateContext";

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function QuotePage() {
  const { t } = useTranslation();
  const { quoteId } = useParams();
  const { getQuotes, getQuotesIsLoading, quotes } = useAppState();
  const [theQuote, setTheQuote] = useState(null);

  useEffect(() => {
    if (!quotes.length) {
      getQuotes();
    } else {
      setTheQuote(quotes.find((quote) => `${quote.id}` === quoteId));
    }
  }, [quoteId, quotes, getQuotes]);

  if (getQuotesIsLoading || !theQuote) {
    return <Loading />;
  }

  if (!theQuote) {
    return (
      <PageContainer>
        <Heading>{t("404QuoteNotFound")}</Heading>
        <DetailRow>
          {t("404QuoteNotFoundErrorMessage", { id: quoteId })}
        </DetailRow>
        <Link to={ROUTES().quotesList}>
          <ActionButton>{t("BackToQuotesList")}</ActionButton>
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Column>
        <QuoteDetails>
          <Heading>{`${theQuote.company} - ${theQuote.object}`}</Heading>
          <DetailRow>
            {t("ID")}: {theQuote.id}
          </DetailRow>
          {theQuote.company && (
            <DetailRow>
              {t("Company")}: {theQuote.company}
            </DetailRow>
          )}
          {theQuote.object && (
            <DetailRow>
              {t("Object")}: {theQuote.object}
            </DetailRow>
          )}
          {theQuote.description && (
            <DetailRow>
              {t("DescriptionOffer")}: {theQuote.description}
            </DetailRow>
          )}
          {theQuote.issuedDate && (
            <DetailRow>
              {t("IssuedDate")}: {formatDate(theQuote.issuedDate)}
            </DetailRow>
          )}
          {theQuote.expiryDate && (
            <DetailRow>
              {t("ExpiryDate")}: {formatDate(theQuote.expiryDate)}
            </DetailRow>
          )}
          {theQuote.commissioner?.companyName && (
            <DetailRow>
              {t("Commissioner")}: {theQuote.commissioner.companyName} (
              {theQuote.commissioner.email})
            </DetailRow>
          )}
          {theQuote.subtotal && (
            <DetailRow>
              {t("Subtotal")}: ${Number(theQuote.subtotal).toFixed(2)}
            </DetailRow>
          )}
          {theQuote.total && (
            <DetailRow>
              {t("TotalPrice")}: ${Number(theQuote.total).toFixed(2)}
            </DetailRow>
          )}
        </QuoteDetails>
      </Column>
      <Column2>
        {theQuote.pdfUrl && (
          <>
            <div>
              <PdfPreview src={theQuote.pdfUrl} />
            </div>
            <ActionButtonContainers>
              <ActionButton
                onClick={() => window.open(theQuote.pdfUrl, "_blank")}
              >
                {t("OpenInNewTab")}
              </ActionButton>
            </ActionButtonContainers>
          </>
        )}
      </Column2>
    </PageContainer>
  );
}

export default QuotePage;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 50px;
  margin-bottom: 50px;
  gap: 2rem;
`;

const Column = styled.div`
  flex: 1;
`;

const Column2 = styled.div`
  flex: 1;
`;

const QuoteDetails = styled.div`
  border-radius: 8px;
  padding: 1rem;
  background: #fff;
  border: 1px solid #e1e1e1;
`;

const Heading = styled.h1`
  font-size: 26px; 
  font-weight: 600; 
  color: #333; 
  margin-bottom: 24px; 
`;

const DetailRow = styled.div`
  font-size: 16px;
  color: #666; 
  padding: 8px 0; 
  border-bottom: 1px solid #f0f0f0; 
  &:last-child {
    border-bottom: none; 
  }
`;

const ActionButtonContainers = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem; 
`;

const ActionButton = styled.button`
  padding: 12px 24px; 
  font-size: 14px; 
  letter-spacing: 0.05em; 
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #444; // Darker on hover for feedback
  }
`;

const PdfPreview = styled.iframe`
  width: 100%;
  height: 500px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: none;
`;
