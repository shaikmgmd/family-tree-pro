import adhesion from "./features/slices/adhesion";
import auth from "./features/slices/auth";
import user from "./features/slices/user";
import role from "./features/slices/role";
import tree from "./features/slices/tree";
import chat from "./features/slices/chat";
import stats from "./features/slices/stats";
import tests from "./features/slices/tests";

const rootReducer = {
    adhesion,
    auth,
    user,
    role,
    tree,
    chat,
    stats,
    tests
};

export default rootReducer;