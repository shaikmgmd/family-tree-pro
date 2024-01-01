import React, {useState, useEffect} from 'react';
import {getAllTestsResultsAction} from "../../store/features/slices/tests";
import {useDispatch, useSelector} from "react-redux";
import {MainWrapper} from "../../components/wrapper/MainWrapper";
import {ClockAfternoon, XCircle, CheckCircle} from "@phosphor-icons/react";
import {FTProLoader} from "../../components/loader/FTProLoader";

const SupervisionDashboard = () => {
    const dispatch = useDispatch();
    const {allTestsResults} = useSelector(state => state.tests)

    const [totals, setTotals] = useState({
        totalRuns: 0,
        totalFailures: 0,
        totalErrors: 0,
        totalSkipped: 0,
        totalTimeElapsed: 0
    });

    useEffect(() => {
        dispatch(getAllTestsResultsAction());
    }, [dispatch]);

    useEffect(() => {
        if (allTestsResults.payload) {
            const totalValues = Object.values(allTestsResults.payload).reduce((acc, result) => ({
                totalRuns: acc.totalRuns + result.testsRun,
                totalFailures: acc.totalFailures + result.failures,
                totalErrors: acc.totalErrors + result.errors,
                totalSkipped: acc.totalSkipped + result.skipped,
                totalTimeElapsed: acc.totalTimeElapsed + result.timeElapsed
            }), {
                totalRuns: 0,
                totalFailures: 0,
                totalErrors: 0,
                totalSkipped: 0,
                totalTimeElapsed: 0
            });

            setTotals(totalValues);
        }
    }, [allTestsResults.payload]);

    return (
        <MainWrapper title="Dashboard de supervision des tests"
                     description="Voici un aperçu des résultats des tests d'API.">

            {allTestsResults.payload ? (
                <div className=" px-4 md:px-8">
                    <div className="mt-1 shadow-sm border rounded-lg overflow-x-auto max-h-[75vh] overflow-y-auto">
                        <table className="w-full table-auto text-sm text-left sticky top-0">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b sticky top-0">
                            <tr>
                                <th className="py-3 px-6">Package du test</th>
                                <th className="py-3 px-6 text-center">Test joués</th>
                                <th className="py-3 px-6 text-center">Echecs</th>
                                <th className="py-3 px-6 text-center">Erreurs</th>
                                <th className="py-3 px-6 text-center">Skipped</th>
                                <th className="py-3 px-6 text-center">Temps écoulé(s)</th>
                            </tr>
                            </thead>
                            <tbody className="text-gray-600 divide-y">
                            <tr className="bg-green-200">
                                <td className="px-6 py-4">Total</td>
                                <td className="px-6 py-4 text-center">{totals.totalRuns}</td>
                                <td className="px-6 py-4 text-center">{totals.totalFailures}</td>
                                <td className="px-6 py-4 text-center">{totals.totalErrors}</td>
                                <td className="px-6 py-4 text-center">{totals.totalSkipped}</td>
                                <td className="px-6 py-4 text-center">{totals.totalTimeElapsed.toFixed(3)}</td>
                            </tr>
                            {
                                Object.entries(allTestsResults?.payload)?.map(([testName, result], idx) => (
                                    <tr key={idx}  className="hover:bg-gray-200">
                                        <td className="px-6 py-4 whitespace-nowrap">{testName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-1.5 justify-center">
                                            <span>{result.testsRun}</span> {result.failures === 0 ?
                                            <span><CheckCircle size={24} color="#10B981"/></span> :
                                            <span><XCircle size={24} color="#EF4444"/></span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">{result.failures}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">{result.errors}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">{result.skipped}</td>
                                        <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3 justify-center">
                                            <span>{result.timeElapsed}</span> <span><ClockAfternoon size={24}
                                                                                                    color="#6B7280"/></span>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <FTProLoader/>
            )}

        </MainWrapper>
    );
};

export default SupervisionDashboard;
