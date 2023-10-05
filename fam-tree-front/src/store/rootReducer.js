import adhesion from "./features/slices/adhesion";
import auth from "./features/slices/auth";
import user from "./features/slices/user";
import role from "./features/slices/role";

const rootReducer = {
    adhesion,
    auth,
    user,
    role
};

export default rootReducer;