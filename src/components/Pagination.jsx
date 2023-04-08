import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


export default function PaginationOutline({ setPage, page, setLoading, loading }) {

    const onChangeHandle = (page) => {
        if (page.textContent) {
            setPage(Number(page.textContent))
        } else if (page = '<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>') {
            setPage((prev) => prev + 1) // бутона назад не бачка поради някаква причина от Material UI
        } else {
            setPage((prev) => Number(prev) - 1)
        }
        setLoading(false)
    }

    return (
        <Stack spacing={2}>
            <Pagination onClick={(e) => onChangeHandle((e.target))} count={44} variant="outlined" color="primary" />
        </Stack>
    );
}
