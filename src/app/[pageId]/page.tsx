// pages/[pageId].js
'use client'


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flex, Heading, Text } from '@chakra-ui/react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import firebase_app from "../../firebase/config"

const db = getFirestore(firebase_app);

// @ts-expect-error
const ProductPage = (props) => {
  const router = useRouter();
  // const { pageId } = router;
  
  const [storeData, setStoreData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<any>(true);
  const pageId=props.params.pageId

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (pageId) {
          // Fetch the store document
          const storeDocRef = collection(db, 'stores').doc(pageId);
          const storeDocSnapshot = await storeDocRef.get();
          const storeDocData = storeDocSnapshot.data();

          // Fetch the products within the store, ordered by createdAt
          const productsQuery = query(
            collection(storeDocRef, 'products'),
            orderBy('createdAt', 'desc')
          );
          const productsSnapshot = await getDocs(productsQuery);
          const productsData = productsSnapshot.docs.map((doc) => doc.data());

          setStoreData(storeDocData);
          setProducts(productsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pageId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" align="center" justify="center" p={4}>
      <Heading mb={4}>Page ID</Heading>

      {storeData && (
        <Flex direction="column" align="center" mb={4}>
          <Heading as="h2" size="md" mb={2}>
            Store Data
          </Heading>
          <Text>{JSON.stringify(storeData, null, 2)}</Text>
        </Flex>
      )}

      {products.length > 0 && (
        <Flex direction="column" align="center">
          <Heading as="h2" size="md" mb={2}>
            Products
          </Heading>
          {products.map((product, index) => (
            <Text key={index}>{JSON.stringify(product, null, 2)}</Text>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default ProductPage;
