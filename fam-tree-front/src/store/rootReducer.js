import adhesion from "./features/slices/adhesion";
import auth from "./features/slices/auth";
import user from "./features/slices/user";
import role from "./features/slices/role";
import tree from "./features/slices/tree";

const rootReducer = {
    adhesion,
    auth,
    user,
    role,
    tree
};

export default rootReducer;