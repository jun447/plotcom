import { useState, useEffect } from 'react';
import { collection, query, orderBy, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export function useListing(queryOptions = {}) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    let q = collection(db, 'listings');
    
    if (queryOptions.orderByField) {
      q = query(q, orderBy(queryOptions.orderByField));
    }
    
    if (queryOptions.filterField && queryOptions.filterValue) {
      q = query(q, where(queryOptions.filterField, '==', queryOptions.filterValue));
    }
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setListings(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching listings:", error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [queryOptions.orderByField, queryOptions.filterField, queryOptions.filterValue]);

  return { listings, loading, error };
}