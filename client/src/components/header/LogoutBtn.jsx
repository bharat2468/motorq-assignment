import { logout } from "../../api/users";
import { logout as logoutAction } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const LogoutBtn = () => {
	const dispatch = useDispatch();
    const navigate = useNavigate();

	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: logout,
		onSuccess: (response) => {
			// Assuming the API returns user data on successful login
			console.log(response.data);
			dispatch(logoutAction());
			navigate("/"); // Redirect to dashboard or home page
		},
		onError: (error) => {
			console.error("Logout failed:", error);
			// Error is already captured in the `error` variable from useMutation
		},
	});

	const handleClick = () => {
		mutate();
	};

	return (
		<>
			<button
				className="btn btn-primary"
				disabled={isPending}
				onClick={handleClick}>
				{isPending ? "Logging out..." : "Logout"}
			</button>
			{isError && (
				<p className="text-error text-sm mt-2">
					Login failed:{" "}
					{error.message ||
						"Please check your credentials and try again."}
				</p>
			)}
		</>
	);
};
export default LogoutBtn;
