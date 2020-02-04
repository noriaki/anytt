import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

// material-ui

// data
import {} from '~/data/types';
import data from '~/data/fixtures/dt.json';

// components
import TimersBoard from '~/components/TimersBoard';

const ResidencePage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <>
      <TimersBoard data={data} />
    </>
  );
};

export default ResidencePage;
