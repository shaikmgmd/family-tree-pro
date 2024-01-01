import React, {useState, useEffect} from 'react';
import StatCard from './StatCard';
import ViewsGraph from './ViewsGraph';
import {useDispatch, useSelector} from "react-redux";
import {
    getLast30DaysViewsAction,
    getLast7DaysViewsAction,
    getTotalViewsAction,
    getViewsPerDayAction,
    postRecordViewAction
} from "../../store/features/slices/stats";
import {getTotalViews} from "../../api/feature/stats";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import {MainWrapper} from "../../components/wrapper/MainWrapper";
import {FTProLoader} from "../../components/loader/FTProLoader";

const DashboardPage = () => {
    const {last7DaysViews, last30DaysViews, totalViews, viewsPerDay} = useSelector(state => state.stats);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getLast7DaysViewsAction());
            await dispatch(getLast30DaysViewsAction());
            await dispatch(getTotalViewsAction());
            await dispatch(getViewsPerDayAction());
        };

        fetchData();
    }, [dispatch]);

    const transformedViewsPerDay = viewsPerDay?.payload?.map(item => {
        const [date, vues] = Object.entries(item)[0];
        return {date, vues};
    });

    const isLoading = totalViews?.loading || last7DaysViews?.loading || last30DaysViews?.loading || viewsPerDay?.loading;

    if (isLoading) {
        return (
            <MainWrapper title="Statistiques"
                         description="Consultez ici les statistiques liées aux visites de votre arbre généalogique !">
                <FTProLoader/>
            </MainWrapper>
        )
    }

    return (
        <MainWrapper title="Statistiques"
                     description="Consultez ici les statistiques liées aux visites de votre arbre généalogique !">
            <div className="bg-gray-100 p-8 px-12">
                <section className="">
                    <div className="flex flex-wrap -mx-4 justify-center">
                        <div className="w-full md:w-1/3 px-4 mb-4 md:mb-0">
                            <StatCard title="Nombre de vues totales" value={totalViews?.payload}/>
                        </div>
                        <div className="w-full md:w-1/3 px-4 mb-4 md:mb-0">
                            <StatCard title="Nombre de vues sur les 7 derniers jours" value={last7DaysViews?.payload}/>
                        </div>
                        <div className="w-full md:w-1/3 px-4 mb-4 md:mb-0">
                            <StatCard title="Nombre de vues sur les 30 derniers jours"
                                      value={last30DaysViews?.payload}/>
                        </div>
                    </div>
                </section>

                <section className="mt-16">
                    <ViewsGraph data={transformedViewsPerDay}/>
                </section>
            </div>
        </MainWrapper>
    );
};

export default DashboardPage;